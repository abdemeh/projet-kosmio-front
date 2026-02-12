import { UploadCloud } from "lucide-react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "../../store/ficheSlice";
import { useDropzone } from "react-dropzone";

const DropDownAddImage = () => {

    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.fiche.isLoading);

    const onDrop = useCallback(acceptedImages => {
        if (acceptedImages.length === 1 && acceptedImages[0].type === 'application/pdf') {
        dispatch(setImage(acceptedImages[0]));
        } else {
        dispatch(setImage(null));
        alert("Veuillez sélectionner une seul image.");
        }
    }, [dispatch]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/gif': ['.gif'], },
        multiple: false,
        disabled: isLoading,
    });

    const baseClasses = "relative group w-full h-64 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer overflow-hidden";
    const activeClasses = isDragActive
        ? 'border-primary bg-primary/5 scale-[0.99]'
        : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-soft';
    const disabledClasses = isLoading ? 'opacity-60 cursor-not-allowed' : '';

    return (
        <div
            {...getRootProps()}
            className={`${baseClasses} ${activeClasses} ${disabledClasses}`}
        >
            <input {...getInputProps()} />

            <div className="z-10 flex flex-col items-center text-center p-6 space-y-4">
                <div className={`p-4 rounded-full transition-colors duration-200 ${isDragActive ? 'bg-primary/20' : 'bg-white shadow-sm'}`}>
                    <UploadCloud size={32} className={`transition-colors duration-200 ${isDragActive ? 'text-primary-dark' : 'text-gray-400 group-hover:text-primary'}`} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isDragActive ? "Lâchez le fichier !" : "Cliquez ou glissez un PDF"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Seulement les png, les jpeg, les jpg et les gifs sont acceptés</p>
                </div>
            </div>
        </div>
  );

}

export default DropDownAddImage