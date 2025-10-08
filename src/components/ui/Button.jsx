// src/components/ui/Button.jsx
import React from "react";
import { motion } from "framer-motion";

function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  ...props
}) {
  const className = `btn btn-${variant}`;

  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05, y: -2 }} // Aumenta e levanta um pouco no hover
      whileTap={{ scale: 0.95 }} // Diminui um pouco ao clicar
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
