export const DropdownIcon = (props) => (
  <svg
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    style={{
      transform: `rotate(${props.rotate}deg)`,
      transition: "transform 0.3s ease",
    }}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
        fill={props.color ? props.color : "currentColor"}
        stroke={props.color ? props.color : "currentColor"}
        strokeWidth="0.5"
      ></path>
    </g>
  </svg>
);

export const XIcon = (props) => (
  <svg
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
        fill="currentColor"
      ></path>
    </g>
  </svg>
);

export const HamburgerIcon = (props) => (
  <svg
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      <path
        d="M20 7L4 7"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M20 12L4 12"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
      <path
        d="M20 17L4 17"
        stroke="#000"
        strokeWidth="1.5"
        strokeLinecap="round"
      ></path>
    </g>
  </svg>
);

export const BookmarkIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ? props.width : 24}
    height={props.height ? props.height : 24}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M21 11.098v4.993c0 3.096 0 4.645-.734 5.321c-.35.323-.792.526-1.263.58c-.987.113-2.14-.907-4.445-2.946c-1.02-.901-1.529-1.352-2.118-1.47a2.2 2.2 0 0 0-.88 0c-.59.118-1.099.569-2.118 1.47c-2.305 2.039-3.458 3.059-4.445 2.945a2.24 2.24 0 0 1-1.263-.579C3 20.736 3 19.188 3 16.091v-4.994C3 6.81 3 4.666 4.318 3.333S7.758 2 12 2s6.364 0 7.682 1.332S21 6.81 21 11.098"
      opacity=".5"
    />
    <path
      fill="currentColor"
      d="M9 5.25a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5z"
    />
  </svg>
);

export const SpinnerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="30"
    viewBox="0 0 80 30"
  >
    <circle cx="20" cy="15" r="6" fill="#f36421" opacity="0.7">
      <animate
        attributeName="r"
        from="6"
        to="10"
        dur="1.2s"
        begin="0s"
        repeatCount="indefinite"
        values="6;10;6"
        keyTimes="0;0.5;1"
      />
      <animate
        attributeName="opacity"
        from="0.7"
        to="1"
        dur="1.2s"
        begin="0s"
        repeatCount="indefinite"
        values="0.7;1;0.7"
        keyTimes="0;0.5;1"
      />
    </circle>
    <circle cx="40" cy="15" r="6" fill="#f36421" opacity="0.7">
      <animate
        attributeName="r"
        from="6"
        to="10"
        dur="1.2s"
        begin="0.4s"
        repeatCount="indefinite"
        values="6;10;6"
        keyTimes="0;0.5;1"
      />
      <animate
        attributeName="opacity"
        from="0.7"
        to="1"
        dur="1.2s"
        begin="0.4s"
        repeatCount="indefinite"
        values="0.7;1;0.7"
        keyTimes="0;0.5;1"
      />
    </circle>
    <circle cx="60" cy="15" r="6" fill="#f36421" opacity="0.7">
      <animate
        attributeName="r"
        from="6"
        to="10"
        dur="1.2s"
        begin="0.8s"
        repeatCount="indefinite"
        values="6;10;6"
        keyTimes="0;0.5;1"
      />
      <animate
        attributeName="opacity"
        from="0.7"
        to="1"
        dur="1.2s"
        begin="0.8s"
        repeatCount="indefinite"
        values="0.7;1;0.7"
        keyTimes="0;0.5;1"
      />
    </circle>
  </svg>
);
