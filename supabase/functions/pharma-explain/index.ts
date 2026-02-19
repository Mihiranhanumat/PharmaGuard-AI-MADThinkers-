import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { drug, gene, diplotype, phenotype, risk_label, severity } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a clinical pharmacogenomics expert. Generate a JSON object with exactly these 4 fields for a patient assessment:

Drug: ${drug}
Gene: ${gene}
Diplotype: ${diplotype}
Phenotype: ${phenotype}
Risk: ${risk_label} (Severity: ${severity})

Return ONLY a valid JSON object with these exact fields:
{
  "summary": "2-3 sentence clinical summary",
  "mechanism": "How the gene variant affects drug metabolism, 2-3 sentences",
  "clinical_impact": "Clinical consequences and what clinicians should know, 2-3 sentences",
  "patient_friendly_explanation": "Simple explanation a patient can understand, 2-3 sentences"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a clinical pharmacogenomics expert. Return ONLY valid JSON, no markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Parse the JSON from the response
    let explanation;
    try {
      // Try to extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      explanation = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      explanation = {
        summary: `${drug} risk assessment: ${risk_label} for ${phenotype} metabolizer (${gene} ${diplotype}).`,
        mechanism: `The ${gene} ${diplotype} diplotype results in ${phenotype} metabolizer status, affecting ${drug} processing.`,
        clinical_impact: `${severity} severity — ${risk_label}. Clinical monitoring and possible dose adjustment recommended.`,
        patient_friendly_explanation: `Your body processes ${drug} differently than average due to your genetic makeup. Your doctor may need to adjust your treatment.`,
      };
    }

    return new Response(JSON.stringify(explanation), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
