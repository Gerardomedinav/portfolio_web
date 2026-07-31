/**
 * Endpoint Serverless en Vercel (/api/chat)
 * Sistema de cascada Multi-Proveedor IA (Gemini -> Groq -> OpenRouter -> Ollama Local -> Anthropic).
 * Si la API Key o cuota del proveedor principal falla o se agota, conmuta automáticamente en tiempo real al siguiente.
 */

async function callGemini(apiKey, systemPrompt, conversationHistory, message) {
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const contents = [
    ...(conversationHistory || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const response = await fetch(geminiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: contents,
      generationConfig: { maxOutputTokens: 4000, temperature: 0.7 }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API HTTP ${response.status}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error('Gemini devolvió respuesta vacía.');
  return reply;
}

async function callGroq(apiKey, systemPrompt, conversationHistory, message) {
  const modelName = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

async function callOpenRouter(apiKey, systemPrompt, conversationHistory, message) {
  const modelName = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct:free';
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: modelName,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

async function callOllama(systemPrompt, conversationHistory, message) {
  const ollamaHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

  const response = await fetch(`${ollamaHost}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama local HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || data.message?.content;
}

async function callAnthropic(apiKey, systemPrompt, conversationHistory, message) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        ...(conversationHistory || []).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Anthropic API HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilizar POST.' });
  }

  try {
    const { message, context, conversationHistory } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'El mensaje del usuario es requerido.' });
    }

    const apiKey = process.env.AI_API_KEY || process.env.ANTHROPIC_API_KEY;

        const systemPrompt = `Sos GerAssist, el asistente virtual inteligente, empático, amigable y guía oficial del portafolio web de Gerardo Medina.

REGLAS DE IDENTIDAD Y TONO DE VOZ:
- JAMÁS te presentes ni te menciones como "asistente comercial" ni "representante comercial". Sos el asistente virtual empático, amigable, cálido, atento y servicial de Gerardo.
- Hablá siempre con mucha calidez, amabilidad, entusiasmo y profesionalismo.
- Tu misión es guiar al usuario por todo el portafolio, dar instrucciones claras sobre cómo usar cada sección, resaltar su sólida formación universitaria (UTN y UNAF), sus proyectos de impacto real, su perfil como Full Stack Developer & Analista de Datos / Data Scientist, y sus funciones de Accesibilidad Universal (WCAG 2.1 AA).
- NO INVENTES INFORMACIÓN. Basate estrictamente en los datos reales del portafolio de Gerardo.

REGLAS DE RESPUESTA, ESTRUCTURA Y CITA:
1. LONGITUD INTERMEDIA Y EQUILIBRADA: Tus respuestas deben tener siempre una **longitud intermedia** (entre 2 a 3 párrafos breves o 3-4 viñetas muy claras y legibles). EVITÁ párrafos kilométricos o extensos, pero tampoco des respuestas vacías de una sola línea.
2. GUÍA E INSTRUCCIONES DE SECCIONES: Explicá con amabilidad cómo navegar e interactuar con las secciones (Inicio, Sobre Mí, Proyectos, Habilidades, Contacto y el Widget de Accesibilidad).
3. PROPUESTA DE CONTACTO O CITA: Antes de finalizar tu mensaje, proponé siempre al usuario coordinar una cita, entrevista o reunión laboral con Gerardo (vía Formulario de Contacto, LinkedIn o Email).
   *Ejemplo:* "¿Te gustaría que coordinemos una reunión o entrevista con Gerardo para conversar sobre tu proyecto o propuesta?"
4. NUNCA CERRAR LA CONVERSACIÓN (SIN DESPEDIDAS): Jamás utilices frases de despedida o cierre definitivo ("hasta luego", "chau", "adiós", "que tengas un buen día"). Terminá SIEMPRE con una pregunta abierta e interactiva que motive al usuario a seguir indagando en los proyectos, habilidades o en el funcionamiento del portafolio.
   *Ejemplo:* "¿Qué otro proyecto o tecnología de Gerardo te gustaría que exploremos juntos ahora?"

PUNTOS CLAVE DEL PERFIL DE GERARDO MEDINA:
- 🎓 **Formación Universitaria**: Técnico Universitario en Programación (UTN), Técnico en Análisis y Diseño de Software (UNAF) y cursa la Licenciatura en Educación Tecnológica (UTN).
- 📊 **Perfil Analítico & Data Science**: Full Stack Developer en evolución hacia Data Analytics / Data Science (Python, SQL, LLMs y visualización).
- ♿ **Accesibilidad Universal (WCAG 2.1 AA)**: Compromiso con el software inclusivo (Lector por voz TTS, filtros de daltonismo, dislexia, TDAH).
- 🤝 **15+ Años de Experiencia**: Excelente inteligencia emocional, empatía y trabajo en equipo.

CONTEXTO ADICIONAL DEL PORTAFOLIO:
${context || 'Gerardo Medina es Desarrollador Full Stack, estudiante de LTE en la UTN y capacitándose en Data Science, LLMs y Ciberseguridad.'}`;

    // Determinar la secuencia de conmutación (Fallback Chain)
    const primaryProvider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

    const fallbackPipeline = [];
    if (primaryProvider === 'gemini') fallbackPipeline.push('gemini', 'groq', 'openrouter', 'ollama', 'anthropic');
    else if (primaryProvider === 'groq') fallbackPipeline.push('groq', 'gemini', 'openrouter', 'ollama', 'anthropic');
    else if (primaryProvider === 'ollama') fallbackPipeline.push('ollama', 'gemini', 'groq', 'openrouter', 'anthropic');
    else fallbackPipeline.push(primaryProvider, 'gemini', 'groq', 'openrouter', 'ollama', 'anthropic');

    const uniqueProviders = [...new Set(fallbackPipeline)];

    let lastError = null;

    for (const prov of uniqueProviders) {
      try {
        let reply = null;
        const key = process.env[`${prov.toUpperCase()}_API_KEY`] || apiKey;

        if (prov === 'gemini' && key) {
          reply = await callGemini(key, systemPrompt, conversationHistory, message);
        } else if (prov === 'groq' && key) {
          reply = await callGroq(key, systemPrompt, conversationHistory, message);
        } else if (prov === 'openrouter' && key) {
          reply = await callOpenRouter(key, systemPrompt, conversationHistory, message);
        } else if (prov === 'ollama') {
          reply = await callOllama(systemPrompt, conversationHistory, message);
        } else if (prov === 'anthropic' && (key || process.env.ANTHROPIC_API_KEY)) {
          reply = await callAnthropic(key || process.env.ANTHROPIC_API_KEY, systemPrompt, conversationHistory, message);
        }

        if (reply) {
          return res.status(200).json({ reply, providerUsed: prov });
        }
      } catch (err) {
        console.warn(`[AI Fallback] El proveedor '${prov}' falló o no está disponible. Intentando con el siguiente en la cascada... Motivo:`, err.message);
        lastError = err;
      }
    }

    // Fallback Inteligente si todos los proveedores fallan o no hay llaves configuradas
    const fallbackResponse = `¡Hola! Soy **GerAssist**, tu guía interactivo en este portafolio. Gerardo Medina es **Desarrollador Full Stack & Analista de Datos** con sólida formación universitaria en la **UTN y UNAF**, apasionado por la **Accesibilidad Universal (WCAG 2.1 AA)** y los proyectos de alto impacto.\n\n¿Te gustaría que coordinemos una entrevista o reunión con Gerardo para conversar sobre una propuesta, o querés que exploremos juntos alguno de sus proyectos destacados?`;

    return res.status(200).json({ reply: fallbackResponse, simulated: true, lastError: lastError?.message });

    return res.status(200).json({ reply: fallbackResponse, simulated: true, lastError: lastError?.message });

  } catch (error) {
    console.error('Error general en /api/chat:', error);
    return res.status(500).json({ 
      error: 'Hubo un inconveniente al procesar la respuesta.',
      details: error.message 
    });
  }
}
