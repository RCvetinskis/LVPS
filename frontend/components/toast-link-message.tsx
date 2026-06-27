import Link from "next/link";

type Props = {
  message: string;
  url?: string;
};

const ToastLinkMessage = ({ message, url }: Props) => {
  return (
    <div className="flex flex-col gap-1 max-w-sm">
      <span>{message}</span>
      {url && (
        <Link
          href={url}
          className="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center gap-1"
        >
          View
        </Link>
      )}
    </div>
  );
};

export default ToastLinkMessage;
