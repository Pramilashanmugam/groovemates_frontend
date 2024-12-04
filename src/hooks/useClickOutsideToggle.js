import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to handle the toggling of a state when a user clicks outside an element.
 * It listens for clicks outside the specified ref and updates the state accordingly.
 *
 * @returns {object} - An object containing the following properties:
 *   - expanded: The current state, indicating whether the element is expanded.
 *   - setExpanded: A function to manually update the expanded state.
 *   - ref: A ref object to attach to the element that should toggle the state when clicked outside.
 */
const useClickOutsideToggle = () => {
  const [expanded, setExpanded] = useState(false); // State to manage expanded state
  const ref = useRef(null); // Ref to track the element for detecting clicks outside

  useEffect(() => {
    /**
     * Handles click events outside of the referenced element.
     * If a click happens outside, it sets the 'expanded' state to false.
     *
     * @param {Event} event - The click event.
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setExpanded(false); // Close the dropdown or menu if clicked outside
      }
    };

    // Adding event listener for mouse clicks
    document.addEventListener("mouseup", handleClickOutside);

    // Cleanup the event listener on component unmount or ref change
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [ref]); // Effect runs when 'ref' changes

  return { expanded, setExpanded, ref }; // Return the state, setter, and ref
};

export default useClickOutsideToggle;
