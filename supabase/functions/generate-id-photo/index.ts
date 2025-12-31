import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, photoType, backgroundColor, aspectRatio } = await req.json();

    if (!image) {
      throw new Error('No image provided');
    }

    // Build the system prompt based on user selections
    const photoTypeInstruction = photoType === 'full-body'
      ? 'Full body: showing the entire person from head to feet, including legs and shoes. The person should be standing straight with their full body visible in the frame.'
      : 'Half body: head and upper torso only, typically from waist up.';

    const backgroundInstruction = {
      white: 'pure white background (#FFFFFF)',
      gray: 'light gray background (#E5E7EB)',
      blue: 'professional blue background (#3B82F6)',
    }[backgroundColor];

    const systemPrompt = `You are an AI specialized in creating professional ID photos. 
You should change the person's wearing to suit professional standards first.
The proportions of people in the generated image should follow the normal proportions of ID photos.
${photoTypeInstruction}
Use a ${backgroundInstruction}.
The person should be centered, well-lit, and facing the camera directly.
Ensure professional appearance with appropriate attire.`;

    const userPrompt = `Transform this photo into a professional ID photo with the following specifications:
- Photo type: ${photoType}
- Background: ${backgroundColor}
- Make sure the subject is well-centered and professionally presented`;

    // Call OnSpace AI for image generation
    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

    if (!apiKey || !baseUrl) {
      throw new Error('OnSpace AI configuration missing');
    }

    console.log('Calling OnSpace AI for image generation...');
    
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        modalities: ['image', 'text'],
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: image } },
            ],
          },
        ],
        image_config: {
          aspect_ratio: aspectRatio,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OnSpace AI Error:', errorText);
      throw new Error(`OnSpace AI: ${errorText}`);
    }

    const result = await response.json();
    console.log('OnSpace AI response received');

    // Extract the generated image
    const generatedImageUrl = result.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      throw new Error('No image generated');
    }

    // Convert base64 to blob and upload to Supabase Storage
    const base64Data = generatedImageUrl.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const blob = new Blob([binaryData], { type: 'image/png' });

    // Create Supabase client with service role for storage operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const fileName = `id-photos/${crypto.randomUUID()}.png`;

    console.log('Uploading to Supabase Storage...');
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, blob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Storage: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully');

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
