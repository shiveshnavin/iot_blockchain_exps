gnome-terminal -e "node index.js 0"
gnome-terminal -e "node index.js 1"
gnome-terminal -e "node index.js 2"
gnome-terminal -e "node index.js 3"
gnome-terminal -e "node index.js 4"

read -p "Open ESP emulator GUI as well ? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1


xdg-open http://127.0.0.1:5000 & xdg-open http://127.0.0.1:5001 & xdg-open http://127.0.0.1:5002  & xdg-open http://127.0.0.1:5003  & xdg-open http://127.0.0.1:5004 
