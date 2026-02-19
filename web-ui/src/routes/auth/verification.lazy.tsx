import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useState } from 'react'
import { type VerificationFlow, type UpdateVerificationFlowBody, type UiNodeInputAttributes, type UiNode } from '@ory/client'
import { kratos } from '@/lib/kratos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Route as VerificationRoute } from './verification'

export const Route = createLazyFileRoute('/auth/verification')({
  component: Verification,
})

const verificationSchema = z.object({
  email: z.string().email("Please enter a valid email"),
})

function Verification() {
  const data = VerificationRoute.useLoaderData() as { flow?: VerificationFlow }
  const initialFlow = data?.flow
  const [flow, setFlow] = useState<VerificationFlow | null>(initialFlow || null)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    // @ts-expect-error: validatorAdapter type mismatch with zodValidator in current version
    validatorAdapter: zodValidator(),
    validators: {
      onChange: verificationSchema,
    },
    onSubmit: async ({ value }) => {
      if (!flow) return

      try {
        const csrfNode = flow.ui.nodes.find((node: UiNode) => (node.attributes as UiNodeInputAttributes).name === 'csrf_token')
        const csrfToken = (csrfNode?.attributes as UiNodeInputAttributes)?.value as string

        const body: UpdateVerificationFlowBody = {
            method: 'code',
            email: value.email,
            csrf_token: csrfToken,
        }

        await kratos.updateVerificationFlow({
            flow: flow.id,
            updateVerificationFlowBody: body,
        })
        
        const { data } = await kratos.getVerificationFlow({ id: flow.id })
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
          <CardTitle>Verify Account</CardTitle>
          <CardDescription>
            Enter your email to receive a verification link.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {flow.ui.messages?.map((msg) => (
                <div key={msg.id} className={`mb-4 p-2 text-sm rounded ${msg.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'}`}>
                    {msg.text}
                </div>
            ))}
          
          {flow.state === 'passed' ? (
              <div className="text-center text-green-600">
                  You have successfully verified your email address.
              </div>
          ) : (
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
                    {form.state.isSubmitting ? 'Sending verification...' : 'Send verification'}
                </Button>
            </form>
          )}

        </CardContent>
        <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
                <Link to="/auth/login" className="underline">
                    Back to Login
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
