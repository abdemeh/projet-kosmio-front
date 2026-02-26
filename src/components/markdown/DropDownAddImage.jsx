import { UploadCloud, X, Image } from "lucide-react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setImage, setSection } from "../../store/ficheSlice";
import { useDropzone } from "react-dropzone";
import { createPortal } from "react-dom";

const DropDownAddImage = ({ onClose }) => {
    const dispatch = useDispatch();
    const isLoading = useSelector(state => state.fiche.isLoading);
    const section = useSelector(state => state.fiche.section);

    const onDrop = useCallback(acceptedImages => {
        if (acceptedImages.length === 1) {
            dispatch(setImage(acceptedImages[0]));
        } else {
            dispatch(setImage(null));
            alert("Veuillez sélectionner une seule image.");
        }
    }, [dispatch]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/gif': ['.gif'],
        },
        multiple: false,
        disabled: isLoading,
    });

    const baseClasses = "relative group w-full h-52 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out cursor-pointer overflow-hidden";
    const activeClasses = isDragActive
        ? 'border-primary bg-primary/5 scale-[0.99]'
        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-soft';
    const disabledClasses = isLoading ? 'opacity-60 cursor-not-allowed' : '';

    const handleChangeSection = (event) => {
        dispatch(setSection(Number(event.target.value)));
    };

    const handleAddImageToSection = () => {
        if (onClose) onClose();
    };

    return createPortal(
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}
        >
            {/* Modal card */}
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 animate-in fade-in zoom-in-95 duration-200">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                        <Image size={20} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">Joindre une image</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPEG, GIF acceptés</p>
                    </div>
                </div>

                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`${baseClasses} ${activeClasses} ${disabledClasses} mb-6`}
                >
                    <input {...getInputProps()} />
                    <div className="z-10 flex flex-col items-center text-center p-6 space-y-3">
                        <div className={`p-4 rounded-full transition-colors duration-200 ${isDragActive ? 'bg-primary/20' : 'bg-white dark:bg-gray-700 shadow-sm'}`}>
                            <UploadCloud size={28} className={`transition-colors duration-200 ${isDragActive ? 'text-yellow-600' : 'text-gray-400 dark:text-gray-300 group-hover:text-yellow-500'}`} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                {isDragActive ? "Lâchez l'image !" : "Cliquez ou glissez une image"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PNG, JPG, GIF jusqu'à 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Section picker + confirm */}
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Section</label>
                        <input
                            type="number"
                            value={section}
                            onChange={handleChangeSection}
                            placeholder="N° de section"
                            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 mt-5">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleAddImageToSection}
                            className="px-5 py-2 text-sm font-semibold text-gray-900 bg-[#FFD700] hover:bg-[#FFE44D] rounded-full transition-all duration-200"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DropDownAddImage;