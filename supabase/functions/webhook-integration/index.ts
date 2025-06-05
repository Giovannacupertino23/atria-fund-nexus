
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { companyId, companyData } = await req.json()

    console.log('Processando dados da empresa:', companyId)

    // Preparar dados para envio ao webhook
    const webhookData = {
      data: JSON.stringify(companyData)
    }

    // Enviar dados para o webhook
    const webhookResponse = await fetch('https://n8n.isilab.com.br/webhook/10183e88-7a23-46bd-bd2f-4e7cd2ef7e08', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData)
    })

    const webhookResult = await webhookResponse.text()
    console.log('Resposta do webhook:', webhookResult)

    // Salvar a resposta do webhook no Supabase
    const { data: savedResponse, error: saveError } = await supabase
      .from('webhook_responses')
      .insert([
        {
          company_id: companyId,
          request_data: webhookData,
          response_data: webhookResult,
          webhook_url: 'https://n8n.isilab.com.br/webhook/10183e88-7a23-46bd-bd2f-4e7cd2ef7e08',
          status: webhookResponse.ok ? 'success' : 'error',
          response_status: webhookResponse.status
        }
      ])
      .select()
      .single()

    if (saveError) {
      console.error('Erro ao salvar resposta:', saveError)
      throw saveError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        webhookResponse: webhookResult,
        savedResponse: savedResponse
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erro na integração do webhook:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
