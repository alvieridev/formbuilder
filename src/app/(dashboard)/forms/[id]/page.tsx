import { GetFormById, getFormSubmissions } from '@/actions/form';
import FormBuilder from '@/components/FormBuilder';
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import React, { ReactNode } from 'react'
import { StatsCard } from '../../page';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { LuView } from 'react-icons/lu';
import { TbArrowBounce } from 'react-icons/tb';
import { ELementsType, FormElementinstance } from '@/components/FormElements';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';


// TODO: add the metadata here depending on the formid. Cache the fetch

async function FormDetailsPage( {params}: {params: { id :string }} ) {
    const {id} = params;
    const form = await GetFormById( Number(id) )

    if ( !form ) {
        throw new Error("Form not Found")
    }

    const {visits, submission: submissions} = form
    let submissionRate = 0;


    if (visits > 0) {
        submissionRate = submissions /( visits ) * 100;
    }

    const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="py-10  border-b border-muted">
         <div className="flex justify-between container ">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          <VisitBtn shareUrl={form.shareURL}/>
        </div>
        <div className="py-4 border-b border-muted">
          <div className="container flex gap-2 items-center justify-between">
            <FormLinkShare shareUrl={form.shareURL} />
          </div>
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
    <StatsCard 
    title='Total visits'
    icon={ <LuView className='text-blue-500 ' /> }
    value={visits.toLocaleString()  || ''}
    helperText='All time form visits'
    loading={false}
    className=' shadow-md shadow-blue-600 '

    />
    <StatsCard 
    title='Total Submissions'
    icon={ <FaWpforms className='text-yellow-600 ' /> }
    value={visits.toLocaleString()  || ''}
    helperText='All time form Submissions'
    loading={false}
    className=' shadow-md shadow-yellow-600 '

    />
    <StatsCard 
    title='Submission Rate'
    icon={ <HiCursorClick className='text-green-600 ' /> }
    value={visits.toLocaleString() + "%"  || ''}
    helperText='Visits that result in form submission'
    loading={false}
    className=' shadow-md shadow-green-600 '

    />
    <StatsCard 
    title='Bouncered Rate'
    icon={ <TbArrowBounce className='text-red-600 ' /> }
    value={visits.toLocaleString() + "%"  || ''}
    helperText='Visits that leave without interacting or Submissions'
    loading={false}
    className=' shadow-md shadow-red-600 '

    />
      </div>
      <div className="container pt-10">
        <SubmissionsTable id={form.id} />
      </div>
    </>
  )
}

export default FormDetailsPage

type Row ={
  [key: string]:string;
} & {
  submittedAt: Date
}
async function SubmissionsTable({id}: {id: number}) {

  const form = await getFormSubmissions(id)

  if(!form) {
    throw new Error("Form not Found")
  }
  const formElements = JSON.parse(form.content) as FormElementinstance[];

  const columns: {
    id:string,
    label:string,
    required:boolean, 
    type: ELementsType
  }[]=[]

  formElements.forEach(element => {
    switch (element.type) {
      case "TextField":
        columns.push({
          id: element.id,
          label:element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.extraAttributes?.type
        })
        break;
    
      default:
        break;
    }
  })

  const rows: Row[] = []
  form.FormSubmissions.forEach((submission) =>{
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt
    });
  } )


  return <>
    <h1 className="font-bold my-4 text-2xl">
      Submissions Table
    </h1>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className='uppercase'>
                {column.label}
              </TableHead>
            ))}
            <TableHead className='text-muted-foreground text-right uppercase'>Submitted at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            rows.map((row, index) =>(
              <TableRow key={index}>
                 {columns.map((column) =>(
                  <RowCell 
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                 ))}
                 <TableCell className="text-muted-foreground text-right" >
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                 </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  </>
}

function RowCell({type, value}:{type: ELementsType, value: string}) {
  let node: ReactNode = value;
  return <TableCell>{node}</TableCell>
}