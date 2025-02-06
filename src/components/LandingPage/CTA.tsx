"use client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CTA = () => {
  const router = useRouter();

  return (
    <div className="relative bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-300/20 to-transparent dark:from-blue-800/20"></div>

      <div className="max-w-3xl mx-auto text-center py-16 px-6 sm:py-20 sm:px-10 lg:px-16 relative z-10">
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl"
        >
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600">
            Boost your productivity.
          </span>
          <span className="block mt-2">Start using our app today.</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-300"
        >
          Join thousands of users who have transformed their task management. 
          Try it risk-free with our 30-day money-back guarantee.
        </motion.p>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <Button
            className="mt-8 px-6 py-3 text-lg font-semibold rounded-xl bg-blue-600 text-white dark:bg-blue-500 shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all transform hover:scale-105"
            onClick={() => router.push("/auth/signup")}
          >
            🚀 Sign up for free
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CTA;
