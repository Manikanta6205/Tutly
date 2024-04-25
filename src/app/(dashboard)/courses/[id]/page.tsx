import React from 'react'
import { getAllAssignedAssignmentsByUserId } from '@/actions/assignments'
import getCurrentUser from '@/actions/getCurrentUser'
import { FaExternalLinkAlt } from "react-icons/fa";


const page = async ({ params }: {
    params: { id: string }
}) => {

    const currentUser = await getCurrentUser();
    const assignments = await getAllAssignedAssignmentsByUserId(currentUser?.id || '')

    const maxWords = 50;
    function truncateText(text: string) {
        const words = text.split(/\s+/);
        if (words.length <= maxWords) {
            return text;
        }
        const truncatedText = words.slice(0, maxWords).join(' ');
        return truncatedText + '...';
    }


    return (
        <div className='m-3'>
            <h1 className='text-xl font-medium p-2'>Information About the course</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 p-2">
                {assignments.coursesWithAssignments?.map(assignment => (
                    assignment.classes.map(classItem => (
                        classItem.attachments.map(attachment => (
                            <div key={attachment?.id} className="bg-white text-slate-500 rounded-lg p-4" style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px" }}>
                                <h2 className="text-lg text-blue-600 font-semibold mb-2">{attachment?.title}</h2>
                                <p className="mb-2">{truncateText(attachment?.details || 'No Description')}</p>
                                <p className=" mb-2"><span className="font-semibold">Created At:</span> {new Date(attachment.createdAt).toLocaleString()}</p>
                                <p className="mb-2"><span className="font-semibold">Updated At:</span> {new Date(attachment.updatedAt).toLocaleString()}</p>
                                <p className="mb-2"><span className="font-semibold">Due Date:</span> {attachment?.dueDate ? new Date(attachment?.dueDate).toLocaleDateString() : 'Not specified'}</p>
                                {/* <p className="text-secondary-200 mb-2">Class Name: {classItem?.class?.title || 'null'}</p> */}
                                <p className="mb-2"><span className="font-semibold">Submission Status:</span> {attachment?.submissions.length > 0 ? 'Submitted' : 'Not Submitted'}</p>
                                {
                                    attachment?.link && (
                                        <div className=' flex items-center justify-start space-x-2 hover:opacity-90'>
                                            <a href={attachment?.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View Assignment</a>
                                            <FaExternalLinkAlt className='w-3 h-3' />
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    ))
                ))}
            </div>
        </div>
    )
}

export default page