// import { db } from "@/lib/db"

import Button from "@/components/ui/Button";
import db from "@/lib/db";



export default async function Home() {
  await db.set('test', 'test');
  return (
    <>
      <Button>Hello</Button>
    </>
  )
}
