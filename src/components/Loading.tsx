export default function Loading(){
    return(
        <div className="flex min-h-screen items-center justify-center bg-amber-100">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-lg text-gray-700">Loading...</p>
                </div>
            </div>
    )
}