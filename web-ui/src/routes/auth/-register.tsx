import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { type RegistrationFlow, type UpdateRegistrationFlowBody, type UiNodeInputAttributes } from '@ory/client'
import { kratos } from '@/lib/kratos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/ui/field'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function Register() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/auth/register' }) as { flow?: string }
  const [flow, setFlow] = useState<RegistrationFlow | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function initFlow() {
      if (search.flow) {
        try {
          const { data } = await kratos.getRegistrationFlow({ id: search.flow })
          setFlow(data)
          setIsReady(true)
        } catch (err) {
          createFlow()
        }
      } else {
        createFlow()
      }
    }

    async function createFlow() {
      try {
        const { data } = await kratos.createBrowserRegistrationFlow()
        setFlow(data)
        setIsReady(true)
      } catch (err: any) {
         if (err.response?.status === 400 && err.response?.data?.error?.id === 'session_already_available') {
             navigate({ to: '/' })
         }
      }
    }

    initFlow()
  }, [search.flow, navigate])

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    // @ts-ignore
    validatorAdapter: zodValidator(),
    validators: {
      onChange: registerSchema,
    },
    onSubmit: async ({ value }) => {
      if (!flow) return

      try {
        const csrfNode = flow.ui.nodes.find((node: any) => node.attributes?.name === 'csrf_token')
        const csrfToken = (csrfNode?.attributes as UiNodeInputAttributes)?.value as string

        const body: UpdateRegistrationFlowBody = {
            method: 'password',
            traits: {
                email: value.email,
            },
            password: value.password,
            csrf_token: csrfToken,
        }

        await kratos.updateRegistrationFlow({
            flow: flow.id,
            updateRegistrationFlowBody: body,
        })
        
        window.location.href = '/'
      } catch (err: any) {
          if (err.response?.status === 400) {
              setFlow(err.response.data)
          }
          console.error(err)
      }
    },
  })

  if (!isReady || !flow) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create an account to start using URL2Short.
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
            <form.Field
              name="password"
              children={(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                  />
                  {field.state.meta.errors ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
                {form.state.isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/auth/login" className="underline">
                    Login
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  )
}
