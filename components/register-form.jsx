"use client"
import { useTransition, useState } from "react";
import { signOut } from "next-auth/react";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { generateLink } from "@/lib/actions"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const formSchema = z.object({
  startDate: z.coerce.date(),
  startTime: z.string().time(),
  endDate: z.coerce.date(),
  endTime: z.string().time(),
});


function generateTimeOptions() {
    const times = [];
    for (let i = 0; i < 24 * 2; i++) {
      const hours = Math.floor(i / 2);
      const minutes = (i % 2) * 30;
      const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      times.push({id: `${time}:00`, str: time});
    }
    return times;
  }

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [retLink, setRetLink] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      "startDate": new Date(),
      "endDate": new Date(),
      "startTime": "12:00:00",
      "endTime": "13:00:00",
    },
  })

  function onSubmit(values) {
    try {
      startTransition(async () => {
        const response = await generateLink(values);
        if (response.success) {
          setRetLink(response.message);
        } else {
          setRetLink(null);
          toast.error(response.message
          );
        }
        
      });
    } catch (error) {
      console.error("Form submission error", error);
    }
  }

  const timeOptions = generateTimeOptions();
  return (
    <div>
    <div className="flex justify-end">
      <Button className="m-2" variant="outline" disabled={isPending} onClick={() => signOut()}>Sign Out</Button>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex p-4">
          <div className="mr-4">    
            <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[220px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
            
                <FormMessage />
              </FormItem>
              )}
              />
          </div>
          <div>       
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {timeOptions.map((time) => (
                            <SelectItem key={time.id} value={time.id}>{time.str}</SelectItem>
                          ))}   
                    </SelectContent>
                  </Select>
                    
                  <FormMessage />
                </FormItem>
              )}
              />
          </div>
        </div>

      <div className="flex p-4">
      <div className="mr-4">        
          <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[220px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          
              <FormMessage />
            </FormItem>
          )}
        />
        </div> 
        <div>
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                  {timeOptions.map((time) => (
                          <SelectItem key={time.id} value={time.id}>{time.str}</SelectItem>
                        ))}  
                  </SelectContent>
                </Select>
                  
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <Button className="m-4" disabled={isPending} type="submit">{isPending ? "Please Wait" : "Submit"}</Button>
      </form>
    </Form>
    {retLink &&
    <div className="flex flex-col items-center space-y-2">
      <Input className="w-[420px]" readOnly value={retLink}/> 
      <Button variant="outline" onClick={() => {
        navigator.clipboard.writeText(retLink);
        toast("Link Copied to Clipboard");
      }}>
        <Copy />
        Copy to Clipboard
      </Button>
      
    </div>
    }
    </div>
  )
}

