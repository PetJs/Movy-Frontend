
type PopUpProps = {
    text: string | React.ReactNode; 
  };
  
export const PopUp: React.FC<PopUpProps> = ({ text }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#B59DB6] p-6 rounded-lg shadow-lg">
                <h2 className="font-semibold text-center">
                    {text}
                </h2>
            </div>
        </div>
    )
}