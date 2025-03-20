import Builder from '@/components/builder/builder'
import React, { Suspense } from 'react'

export default function BuilderPage(){
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Builder />
        </Suspense>
    )
}