import { GetFormStats, GetForms } from "@/actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Suspense } from "react";
import {LuView} from "react-icons/lu";
import {FaWpforms} from "react-icons/fa";
import {HiCursorClick} from "react-icons/hi";
import {TbArrowBounce} from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import CreateFormButton from "@/components/CreateFormButton";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from 'next-view-transitions'
import {BiRightArrowAlt} from  "react-icons/bi"
import {FaEdit} from  "react-icons/fa"



export default function Home() {
  return (
  <div className="container pt-4">
    <Suspense fallback={<StatsCards loading={true} /> } >
      <CardStatsWrapper />
    </Suspense>
    <Separator className="my-6"/>
    <h2 className="text-4xl font-bold col-span-2">Your Forms</h2>
    <Separator className="my-6"/>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <CreateFormButton />
      <Suspense fallback={ [1, 2, 3, 4].map((el) => (
        <FormCardSkeleton key={el} />
      ) )} >
        <FormCards />
      </Suspense>
    </div>
  </div>
  );
}


async function CardStatsWrapper () {
  const stats = await GetFormStats()

  return <StatsCards loading={false} data={stats} />
}

interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof GetFormStats >>,
  loading: boolean


}

function StatsCards( props: StatsCardsProps ) {
  const {data, loading} = props;

  return <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
    <StatsCard 
    title='Total visits'
    icon={ <LuView className='text-blue-500 ' /> }
    value={data?.visits.toLocaleString()  || ''}
    helperText='All time form visits'
    loading={loading}
    className=' shadow-md shadow-blue-600 '

    />
    <StatsCard 
    title='Total Submissions'
    icon={ <FaWpforms className='text-yellow-600 ' /> }
    value={data?.visits.toLocaleString()  || ''}
    helperText='All time form Submissions'
    loading={loading}
    className=' shadow-md shadow-yellow-600 '

    />
    <StatsCard 
    title='Submission Rate'
    icon={ <HiCursorClick className='text-green-600 ' /> }
    value={data?.visits.toLocaleString() + "%"  || ''}
    helperText='Visits that result in form submission'
    loading={loading}
    className=' shadow-md shadow-green-600 '

    />
    <StatsCard 
    title='Bouncered Rate'
    icon={ <TbArrowBounce className='text-red-600 ' /> }
    value={data?.visits.toLocaleString() + "%"  || ''}
    helperText='Visits that leave without interacting or Submissions'
    loading={loading}
    className=' shadow-md shadow-red-600 '

    />
  </div>  

}


function StatsCard( {
  title, icon, value, helperText, loading, className
}: {
  title:string;
  icon:React.ReactNode;
  value:string;
  helperText:string;
  loading:boolean;
  className?:string;
}

) {
  return <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-center pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground" title={title}></CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {
          loading && <Skeleton>
            <span className="opacity-0">0</span>
          </Skeleton>
        } 
        {
          !loading && value
        }
      </div>
      <div className="text-xs text-muted-foreground pt-1">{helperText}</div>
    </CardContent>
  </Card>
}


function FormCardSkeleton (){
 return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full"/>
}


async function FormCards() {
  const forms = await GetForms()
  
  return <>
      {
        forms.map((form) => (
          <FormCard key={form.id} form={form} />
        ))
      }
  </>
}

 function FormCard( { form }: {form: Form}) {
    return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">
          {form.name}
          </span>
          {
            form.published && <Badge>Published</Badge>
          }
          {
            !form.published && <Badge variant={"destructive"}>Draft</Badge>
          }
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex items-center justify-between">
          {
            formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
              // locale: true TODO
            })
          }
          {
            form.published && (
              <span className="flex items-center gap-2">
                <LuView className="text-muted-foreground"/>
                <span> { form.visits.toLocaleString() } </span>
                <FaWpforms className="text-muted-foreground"/>
                <span> { form.submission.toLocaleString() } </span>
              </span>
            )
          }
        </CardDescription>
      </CardHeader>
      <CardContent className=" h-[120px] truncate text-sm text-muted-foreground ">
        {
          form.description || "No description available"
        }
        </CardContent>   
        <CardFooter>
          {
            form.published && (
              <Button asChild className="w-full mt-2 text-xl gap-3">
                <Link href={`/forms/${form.id}`}>
                  View Submissions
                  <BiRightArrowAlt />
                </Link>
              </Button>
            )
          }
          {
            form.published && (
              <Button variant={'secondary'} asChild className="w-full mt-2 text-xl gap-3">
                <Link href={`/builder/${form.id}`}>
                 Edit Form
                  <FaEdit />
                </Link>
              </Button>
            )
          }
        </CardFooter> 
    </Card>
}
