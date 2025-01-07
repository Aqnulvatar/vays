const SuccessNotification = ({ title, detail }: { title: string; detail: string }) => {
  return (
    <>
      <div className="flex flex-grow items-center gap-5">
        <div className="flex h-10 w-full max-w-10 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1EA779"
          >
            <path d="m414-280 226-226-58-58-169 169-84-84-57 57 142 142ZM260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z" />
          </svg>
        </div>
        <div>
          {/* Need to be more explicit with the text color to overwrite the default style of toastify. */}
          <h4 className="mb-0.5 text-title-xsm font-medium text-black dark:text-white">{title}</h4>
          <p className="text-sm font-medium dark:text-bodydark">{detail}</p>
        </div>
      </div>
    </>
  );
};

export default SuccessNotification;
