import { createServerFn } from '@tanstack/react-start'
import { Resend } from 'resend'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  description: z.string(),
  type: z.enum(['join', 'sponsor']),
})

export const sendContactEmail = createServerFn({ method: 'POST' })
  .handler(async ({ data }: { data: unknown }) => {
    const parsedData = contactSchema.parse(data)
    
    const resend = new Resend(process.env.RESEND_API_KEY)

    try {
      const { data, error } = await resend.emails.send({
        from: 'CCBC Preseason <onboarding@resend.dev>',
        to: ['nick@calgarycbclub.com'], // Replace with your actual email
        subject: `New ${parsedData.type === 'join' ? 'Team Join Request' : 'Sponsorship Inquiry'}`,
        html: `
          <h1>New Contact Request</h1>
          <p><strong>Type:</strong> ${parsedData.type}</p>
          <p><strong>Name:</strong> ${parsedData.name}</p>
          <p><strong>Email:</strong> ${parsedData.email}</p>
          <p><strong>Phone:</strong> ${parsedData.phoneNumber}</p>
          <p><strong>Description:</strong></p>
          <p>${parsedData.description}</p>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        throw new Error('Failed to send email')
      }

      return { success: true, data }
    } catch (error) {
      console.error('Failed to send email:', error)
      throw error
    }
  })
