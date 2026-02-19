import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { kratos } from '@/lib/kratos'

const verificationSearchSchema = z.object({
    flow: z.string().optional(),
    return_to: z.string().optional(),
})

export const Route = createFileRoute('/auth/verification')({
    validateSearch: (search) => verificationSearchSchema.parse(search),
    loaderDeps: ({ search: { flow, return_to } }) => ({ flow, return_to }),
    loader: async ({ deps: { flow, return_to } }) => {
        try {
            if (flow) {
                const { data } = await kratos.getVerificationFlow({ id: flow })
                return { flow: data }
            } else {
                const { data } = await kratos.createBrowserVerificationFlow({
                    returnTo: return_to,
                })
                return { flow: data }
            }
        } catch (err: any) {
             if (err.response?.status === 400 && err.response?.data?.error?.id === 'session_already_available') {
                throw redirect({ to: '/' })
            }
            try {
                const { data } = await kratos.createBrowserVerificationFlow({
                    returnTo: return_to,
                })
                return { flow: data }
            } catch (e) {
                throw e
            }
        }
    },
})
