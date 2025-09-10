// Simple in-memory chat responses
const responses = {
  'hola': '¡Hola! ¿En qué puedo ayudarte hoy?',
  'como estas': '¡Estoy aquí para ayudarte! ¿En qué puedo asistirte?',
  'ayuda': 'Puedo ayudarte con: \n- Información general\n- Soporte técnico\n- Preguntas frecuentes\n\n¿Sobre qué necesitas ayuda?',
  'default': 'Gracias por tu mensaje. Un miembro de nuestro equipo revisará tu consulta y te responderá pronto.'
};

export const chatHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensaje inválido' });
    }

    // Simple response matching (case insensitive)
    const lowerMessage = message.toLowerCase();
    let reply = responses.default;

    // Check for matching responses
    for (const [key, value] of Object.entries(responses)) {
      if (lowerMessage.includes(key)) {
        reply = value;
        break;
      }
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error en el chat:', error);
    return res.status(500).json({ 
      error: 'Ocurrió un error al procesar tu mensaje',
      reply: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo más tarde.'
    });
  }
};

// For Next.js API route compatibility
export default async function handler(req, res) {
  return chatHandler(req, res);
}
