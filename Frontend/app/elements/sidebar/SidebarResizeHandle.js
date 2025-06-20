const SidebarResizeHandle = ({ onMouseDown, isResizing, currentTheme }) => (
  <div
    onMouseDown={onMouseDown}
    className={`absolute top-0 left-0 h-full w-2 cursor-col-resize group z-10 select-none ${isResizing ? 'bg-blue-500/20' : ''}`}
  >
    <div className={`w-[1px] h-full mx-auto transition-colors duration-200 ${
      currentTheme === 'dark' 
        ? 'bg-gray-700/60 group-hover:bg-blue-400' 
        : 'bg-gray-300 group-hover:bg-blue-500'
    } ${isResizing ? (currentTheme === 'dark' ? 'bg-blue-400' : 'bg-blue-500') : ''}`}></div>
  </div>
);

export default SidebarResizeHandle;
