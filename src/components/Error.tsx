export default function Error({error}:{error:any}){
    return(
         <div className="flex justify-center min-h-screen bg-amber-100">
                <div className="text-red-500 text-lg w-fit bg-white p-5 mt-5 rounded-2xl shadow-2xl border-2 border-red-400 h-fit">{error}</div>
            </div>
    )
}