'use client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import qs from 'query-string'
import { 
Form,
FormControl,
FormField,
FormItem
} from '../ui/form'

import {
Input
} from "@/components/ui/input"
import { Plus, Smile } from 'lucide-react'
import { useModal } from '@/hooks/use-model-store'
import EmojiPicker from '../EmojiPicker'
import { useRouter } from 'next/navigation'
interface ChatInputProps{
    apiUrl:string,
    query:Record<string,any>,
    name:string,
    type:"channel" | "conversation"
}

const formSchema=z.object({
    content:z.string().min(1)
})

export const ChatInput=({
    apiUrl,
    query,
    name,
    type
}:ChatInputProps)=>{
    const {onOpen}=useModal()
    const router=useRouter()
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            content:""
        }
    })

    const isloading=form.formState.isSubmitting

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
      try {
        const url=qs.stringifyUrl({
            url:apiUrl,
            query
        })

        console.log(values)
        await axios.post(url,values)
        form.reset()
        router.refresh()
      } catch (error) {
        console.log(error);
        
      }
        
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                control={form.control}
                name='content'
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <div className='relative p-4 pb-6'>
                                <button
                                type='button'
                                onClick={()=>onOpen('messageFile',{apiUrl,query})}
                                className="absolute top-7 left-8 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:dark:bg-zinc-300 hover:bg-zinc-600 transition rounded-full p-1 flex items-center justify-center"
                                >
                                <Plus className='text-white dark:[#313338]'/>
                                </button>
                                <Input 

                                disabled={isloading}
                                className="px-14 py-6 bg-zinc-200/90
                                dark:bg-zinc-700/75 border-none 
                                focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200
                                "
                                placeholder={`Message ${type==='conversation'?name:"#"+name}`}
                                {...field}
                                />
                                <div className='absolute top-7 right-8'>
                                    <EmojiPicker
                                    onChange={(emoji:string)=>field.onChange(`${field.value} ${emoji}`)}
                                    />
                                </div>
                            </div>
                        </FormControl>
                    </FormItem>
                )}
                />
    
            </form>
        </Form>
    )
}