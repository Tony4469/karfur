import React from "react";

const femmeDispo = ({width, height, fill, ...props}) => (
  <svg {...props} width={width || "300"} height={height || "420"} viewBox={"0 0 " + (width || "300") + " " + (height || "420")} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M164.418 87.474C169.41 92.6621 174.796 95.9655 177.732 95.9928C185.095 96.0613 192.485 71.0131 189.82 59.6437C187.156 48.2743 160.923 36.601 154.265 55.9286C151.954 62.6366 153.187 69.5061 156.09 75.6198L138.995 109.03L161.064 114.943L164.418 87.474Z" fill="#B28B67"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M186.604 51.7554C186.179 51.318 185.292 50.3976 184.818 50.0231C184.707 49.9336 183.989 49.0618 183.963 49.0634C183.23 49.1103 181.059 49.4268 180.698 50.1062C180.657 50.1541 180.618 50.1988 180.581 50.2371C180.171 50.6651 179.78 51.1116 179.399 51.5675C178.563 52.5682 177.786 53.64 177.032 54.708C175.563 56.7877 174.191 58.9512 172.877 61.136C171.54 63.36 170.3 65.6402 168.994 67.8835C167.116 71.1114 164.995 74.183 163.124 77.4113C161.928 79.4726 160.992 81.6312 160.537 83.9604C160.531 83.9883 160.525 84.0157 160.52 84.0443C160.518 84.0559 160.516 84.0676 160.514 84.0793C160.447 84.4381 160.391 84.8007 160.347 85.1678C160.31 85.482 160.274 85.7973 160.24 86.1134C161.557 84.6309 162.717 82.9196 163.892 81.315C164.007 81.1579 164.119 80.9987 164.23 80.8385C164.552 80.5353 164.877 80.236 165.204 79.9387C167.268 78.064 169.336 76.1991 171.351 74.2674C174.976 70.7931 178.601 67.2248 182.601 64.2144C183.783 63.3254 184.98 62.4591 186.152 61.558C186.82 61.0452 187.477 60.5181 188.122 59.9752C188.583 59.587 190.477 58.3107 190.221 57.1702C190.089 56.5866 187.705 52.8903 186.604 51.7554Z" fill="#2C2C2C"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M184.956 50.1494C185.403 50.4465 185.438 49.3584 185.059 48.8705C183.3 46.6102 175.029 43.7447 167.281 43.3032C162.091 43.0074 155.692 44.0179 150.89 46.2344C146.56 48.2326 142.86 52.3041 140.383 56.5322C137.783 60.9719 136.245 65.9146 135.662 71.0253C135.534 72.1479 135.604 73.2693 135.514 74.3775C135.412 75.6255 135.217 76.8009 135.294 78.0622C135.341 78.8344 135.558 79.6371 135.569 80.4041C135.582 81.2792 135.239 81.9939 134.849 82.776C134.214 84.0507 133.513 85.305 132.684 86.4631C131.44 88.2021 130.074 89.777 128.984 91.6355C127.533 94.1084 122.13 101.973 123.743 104.943L166.519 116.405C166.23 113.175 163.924 108.847 164.113 105.524C164.225 103.566 165.126 99.4665 165.125 99.3085C165.944 92.399 164.913 88.7183 164.043 87.2498C163.173 85.7812 161.697 85.006 161.885 83.9844C162.658 79.7594 165.363 76.2372 167.602 72.7005C170.27 68.4852 172.585 64.0531 175.294 59.8654C176.493 58.0109 182.633 48.6069 184.956 50.1494Z" fill="#8991DC"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M163.089 65.3137C164.618 58.2208 165.697 55.5791 168.683 50.8883L167.689 50.6218C165.571 52.2336 162.589 58.0998 162.298 65.1017L163.089 65.3137ZM143.685 59.7609L143.685 59.7609L143.685 59.7609C143.625 59.2893 143.564 58.8066 143.5 58.311L142.786 58.4457C142.824 66.2847 143.74 72.5737 150.806 79.5337L151.576 79.2531C145.181 71.5946 144.601 67.0024 143.685 59.7609ZM157.586 56.1082L157.586 56.1084C156.305 65.6832 155.492 71.755 159.318 84.1868L158.499 84.2156C153.824 72.3844 154.822 64.0179 157.12 54.0583L157.841 54.1907C157.755 54.8465 157.67 55.4848 157.586 56.1082ZM142.595 82.254L141.737 82.8683C144.798 84.4166 146.363 87.3948 148.157 90.8089C150.056 94.4213 152.211 98.5216 156.665 101.933L157.746 101.618C153.042 97.3079 151.256 93.7986 149.697 90.7344C148.083 87.5622 146.711 84.867 142.595 82.254Z" fill="black" fillOpacity="0.2"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M111.043 193.258C112.76 216.708 223.342 285.749 223.987 287.686C224.417 288.978 189.567 369.332 189.567 369.332L199.233 373.092C199.233 373.092 252.687 287.991 249.942 278.923C246.011 265.941 164.143 193.507 164.143 193.507L111.043 193.258Z" fill="#B28B67"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M192.111 357.234L207.893 362.985C241.172 325.4 254.216 294.389 251.838 278.589C249.459 262.788 166.335 193.315 166.335 193.315L109.911 193.315C111.837 247.623 214.332 287.893 215.703 290.207C217.074 292.522 203.582 315.187 192.111 357.234Z" fill="#2F3676"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M188.93 367.461C188.082 366.652 186.722 366.663 185.972 367.563C184.671 369.124 182.869 371.447 182.326 372.941C181.446 375.363 180.562 380.303 180.562 380.303C183.369 381.326 231.018 398.685 231.018 398.685C231.018 398.685 235.351 392.894 231.302 390.831C227.253 388.768 224.603 387.329 224.603 387.329L204.992 368.355C204.587 367.963 203.939 367.983 203.559 368.399L200.754 371.474C200.754 371.474 196.165 371.877 193.712 370.983C192.247 370.45 190.278 368.746 188.93 367.461Z" fill="#E4E4E4"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M123.758 193.258L74.4965 311.633L26.0803 411.71H37.5033L162.478 193.258H123.758Z" fill="#997659"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M28.1332 406.067C27.0599 405.598 25.7848 406.074 25.3876 407.176C24.6986 409.088 23.7996 411.888 23.7996 413.478C23.7996 416.055 24.6575 421 24.6575 421C27.6448 421 78.3511 421 78.3511 421C78.3511 421 80.4441 414.074 75.9347 413.522C71.4254 412.97 68.4428 412.525 68.4428 412.525L43.5322 401.409C43.0174 401.179 42.4147 401.42 42.2 401.941L40.6146 405.791C40.6146 405.791 36.4402 407.74 33.8303 407.74C32.2714 407.74 29.8393 406.814 28.1332 406.067Z" fill="#E4E4E4"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M30.4526 390.92L55.8345 395.684C75.4597 366.804 157.592 248.385 166.597 193.258H110.091C80.0188 233.109 49.1595 361.562 30.4526 390.92Z" fill="#5C63AB"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M227.425 219.726L205.44 189.109L193.925 202.831L218.668 223.999C223.668 236.139 226.903 241.573 228.373 240.303C229.614 239.233 229.388 237.78 229.18 236.441C229.018 235.398 228.867 234.425 229.428 233.757C230.709 232.23 236.082 234.181 241.102 236.251C246.122 238.321 245.366 235.54 244.492 234.004C240.26 229.147 234.571 224.387 227.425 219.726ZM64.2395 229.801C67.9706 224.707 86.9144 171.981 86.9144 171.981L106.493 175.513C106.493 175.513 78.0085 230.946 75.9296 234.279C73.2291 238.608 75.2265 245.942 76.5808 250.915C76.7903 251.684 76.9845 252.397 77.1435 253.034C73.9037 253.849 72.748 251.969 71.5296 249.987C70.1534 247.749 68.6973 245.38 64.0679 246.618C62.2793 247.096 60.5548 247.731 58.87 248.35C53.0503 250.49 47.704 252.457 41.8262 247.22C40.8943 246.389 40.1771 243.755 43.281 242.343C51.0139 238.825 62.4154 232.292 64.2395 229.801Z" fill="#B28B67"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M157.101 99.5105L165.453 99.5482C173.256 136.909 192.033 172.917 221.783 207.572L189.867 234.897C162.253 188.153 148.206 142.474 157.101 99.5105Z" fill="#191847"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M103.78 195.255L175.969 207.984C175.969 207.984 161.648 142.505 169.173 99.8285L147.969 92.7412C125.998 117.274 115.184 150.342 103.78 195.255Z" fill="#DDE3E9"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M65.5059 220.437C89.1208 132.676 147.491 92.6569 147.491 92.6569L147.506 92.6753C147.509 92.6707 147.513 92.666 147.517 92.6614L148.938 92.9121C151.474 93.4499 156.654 94.5993 156.654 94.5993L159.262 110.579C155.243 138.253 149.45 223.247 149.45 223.247L102.198 214.915C101.604 218.754 101.098 222.664 100.692 226.642L65.5059 220.437Z" fill="#2F3676"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M102.141 215.286C104.701 198.563 108.935 183.183 113.893 169.464C112.22 186.486 111.348 207.169 115.305 217.607L102.141 215.286Z" fill="black" fillOpacity="0.1"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M117.726 188.039L142.975 181.295L141.06 192.153L117.726 188.039Z" fill="white" fillOpacity="0.2"/>
  </svg>
)

export default femmeDispo;