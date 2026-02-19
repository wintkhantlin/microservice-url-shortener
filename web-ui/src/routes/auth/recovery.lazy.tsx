import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useState } from 'react'
import { type RecoveryFlow, type UpdateRecoveryFlowBody, type UiNodeInputAttributes, type UiNode } from '@ory/client'
import { kratos } from '@/lib/kratos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Route as RecoveryRoute } from './recovery'

export const Route = createLazyFileRoute('/auth/recovery')({
  component: Recovery,
})

const recoverySchema = z.object({
  email: z.string().email("Please enter a valid email"),
})

function Recovery() {
  const data = RecoveryRoute.useLoaderData() as { flow?: RecoveryFlow }
  const initialFlow = data?.flow
  const [flow, setFlow] = useState<RecoveryFlow | null>(initialFlow || null)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    // @ts-expect-error: validatorAdapter type mismatch with zodValidator in current version
    validatorAdapter: zodValidator(),
    validators: {
      onChange: recoverySchema,
    },
    onSubmit: async ({ value }) => {
      if (!flow) return

      try {
        const csrfNode = flow.ui.nodes.find((node: UiNode) => (node.attributes as UiNodeInputAttributes).name === 'csrf_token')
        const csrfToken = (csrfNode?.attributes as UiNodeInputAttributes)?.value as string

        const body: UpdateRecoveryFlowBody = {
            method: 'code',
            email: value.email,
            csrf_token: csrfToken,
        }

        await kratos.updateRecoveryFlow({
            flow: flow.id,
            updateRecoveryFlowBody: body,
        })
        
        // After successful submission, Kratos usually sends an email.
        // We might want to show a success message or redirect.
        // For now, let's just refresh the flow to show any messages.
        const { data } = await kratos.getRecoveryFlow({ id: flow.id })
        setFlow(data)

      } catch (err: unknown) {
          if ((err as any).response?.status === 400) {
              setFlow((err as any).response.data)
          }
          console.error(err)
      }
    },
  })

  if (!flow) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Account Recovery</CardTitle>
          <CardDescription>
            Enter your email to recover your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {flow.ui.messages?.map((msg) => (
                <div key={msg.id} className={`mb-4 p-2 text-sm rounded ${msg.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'}`}>
                    {msg.text}
                </div>
            ))}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.Field
              name="email"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    placeholder="m@example.com"
                  />
                  {field.state.meta.errors ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? 'Sending recovery email...' : 'Send recovery email'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link to="/auth/login" className="underline">
                    Login
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
