import 'server-only';

import { z } from 'zod';
import ControlContainer from '@/components/control-containter';
import { dbCheckLink }  from '@/lib/dbfuncs';

const paramsSchema = z.object({
  id: z.string().uuid(),
});

export default async function Home({ searchParams }) {
  
  const params  = await searchParams
  const response = paramsSchema.safeParse(params);
  if (!response.success) {
    return (
    <main>
      <h1 className=" m-4 text-2xl">Hello</h1>
    </main>
    )
  }

  const link = await dbCheckLink(response.data.id);
  if (!link) {
    return (
      <main>
        <h1 className=" m-4 text-2xl">Link not valid or expired</h1>
    </main>
      )
  }
  
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <ControlContainer id={params.id} />
    </main>
  )
}
