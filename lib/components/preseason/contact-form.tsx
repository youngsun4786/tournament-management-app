import { Button } from '~/lib/components/ui/button'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { Textarea } from '~/lib/components/ui/textarea'

import { useAppForm } from '~/lib/hooks/form'
import { sendContactEmail } from '~/src/controllers/form.api'


export function ContactForm({ type, onSuccess }: { type: 'join' | 'sponsor', onSuccess: () => void }) {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      description: '',
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>
        }
        if (value.name.trim().length === 0) {
          errors.fields.name = 'Name is required'
        }
        if (value.email.trim().length === 0) {
          errors.fields.email = 'Email is required'
        }
        if (value.phoneNumber.trim().length === 0) {
          errors.fields.phoneNumber = 'Phone number is required'
        }
        if (value.description.trim().length === 0) {
          errors.fields.description = 'Description is required'
        }
        return errors
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await sendContactEmail({
          data: {
            ...value,
            type,
          },
        } as any)
        alert('Request sent successfully!')
        onSuccess()
      } catch (error) {
        console.error('Failed to send request:', error)
        alert('Failed to send request. Please try again.')
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-5 py-4"
    >
      <form.Field name="name">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Full Name
            </Label>
            <Input
              id="name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-orange-500/20"
              placeholder="Enter your full name"
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-xs font-medium text-red-400">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="email">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-orange-500/20"
              placeholder="name@example.com"
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-xs font-medium text-red-400">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="phoneNumber">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="h-12 border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-orange-500/20"
              placeholder="123-456-7890"
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-xs font-medium text-red-400">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
              {type === 'join' ? 'Team Details / Experience' : 'Sponsorship Details'}
            </Label>
            <Textarea
              id="description"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="min-h-[120px] resize-none border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-orange-500/20"
              placeholder={type === 'join' ? "Tell us about your team or basketball experience..." : "Tell us about your sponsorship interest..."}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-xs font-medium text-red-400">{field.state.meta.errors[0]}</p>
            )}
          </div>
        )}
      </form.Field>

      <div className="pt-2">
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="h-12 w-full bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-bold tracking-wider text-white transition-all hover:from-orange-400 hover:to-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] disabled:opacity-50"
            >
              {isSubmitting ? 'SENDING REQUEST...' : 'SUBMIT REQUEST'}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}