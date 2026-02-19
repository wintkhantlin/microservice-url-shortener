import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { kratos } from '@/lib/kratos'

const settingsSearchSchema = z.object({
    flow: z.string().optional(),
    return_to: z.string().optional(),
})

export const Route = createFileRoute('/auth/settings')({
    validateSearch: (search) => settingsSearchSchema.parse(search),
    loaderDeps: ({ search: { flow, return_to } }) => ({ flow, return_to }),
    loader: async ({ deps: { flow, return_to } }) => {
        try {
            if (flow) {
                const { data } = await kratos.getSettingsFlow({ id: flow })
                return { flow: data }
            } else {
                const { data } = await kratos.createBrowserSettingsFlow({
                    returnTo: return_to,
                })
                return { flow: data }
            }
        } catch (err: any) {
             if (err.response?.status === 401) {
                throw redirect({ to: '/auth/login' })
            }
            try {
                const { data } = await kratos.createBrowserSettingsFlow({
                    returnTo: return_to,
                })
                return { flow: data }
            } catch (e) {
                throw e
            }
        }
    },
})
