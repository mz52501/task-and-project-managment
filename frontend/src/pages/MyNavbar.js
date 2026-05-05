import {useEffect, useRef, useState} from "react";
import {Link, Outlet} from "react-router-dom";
import {RxDropdownMenu} from "react-icons/rx";
import {motion} from "framer-motion";

export function MyNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const sidebarRef = useRef(null); // ✅ No type needed
    const topBarRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && topBarRef.current && !topBarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="flex flex-col h-screen">
            {/* Top Bar */}
            <div ref={topBarRef}
                 className="h-16 w-full flex-none bg-blue-600 flex justify-between items-center px-4 shadow-md">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white text-5xl hover:scale-110 transition-transform duration-200"
                >
                    <RxDropdownMenu/>
                </button>

                <Link to="/" className="flex items-center gap-3">
                    <p className="text-3xl font-bold text-white">HyperFlow</p>
                    <div className="w-16 h-16 rounded-full overflow-hidden py-2">
                        <img className="object-cover w-full h-full" src="/HyperFlow-white.png" alt="logo"/>
                    </div>
                </Link>
            </div>

            {/* Sidebar */}
            <motion.div
                ref={sidebarRef}
                initial={{x: -250}}
                animate={{x: isOpen ? 0 : -250}}
                transition={{duration: 0.3, ease: "easeInOut"}}
                className={`h-full w-52 bg-white backdrop-blur-sm bg-opacity-70 flex flex-col gap-6 items-center rounded-sm shadow-md shadow-gray-400
                fixed top-16 left-0 z-10 h-screen`}
            >
                <div className="flex flex-col items-center mt-4">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                        <img className="object-cover w-full h-full" src="/head.jpg" alt="Profile"/>
                    </div>
                    <p className="text-blue-800 font-semibold text-lg mt-2">Marko Žura</p>
                </div>

                <div className="flex flex-col gap-5 w-full px-4">
                    {["Home", "Projects", "Tasks", "Profile", "Notifications"].map((item) => (
                        <Link
                            to={item === "Home" ? "/" : "/" + item.toLowerCase()}
                            key={item}
                            onClick={() => setIsOpen(false)}
                            className="bg-white w-full flex justify-center py-2 border-2 border-blue-700 rounded-md text-blue-800 font-semibold shadow-lg transform transition-transform duration-200 hover:scale-110 hover:bg-gray-50"
                        >
                            {item}
                        </Link>
                    ))}
                </div>
            </motion.div>

            <Outlet/>
        </div>
    );
}
