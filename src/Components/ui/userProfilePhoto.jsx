export default function UserProfilePhoto({ userName }) {
    return (
        <div className="flex items-center justify-center">
            <img
                src={`https://ui-avatars.com/api/?name=${userName}&background=random`}
                alt={userName}
                className="w-10 h-10 rounded-full shadow-md"
            />
        </div>
    );
}