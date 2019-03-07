title ESP Emulator
@echo off
set /p var=Open ESP emulator GUI as well ?[Y/N]: 
if %var%== Y goto YES
if not %var%== Y goto NO 
:YES
start http://127.0.0.1:5000 
start http://127.0.0.1:5001 
start http://127.0.0.1:5002  
start http://127.0.0.1:5003  
start http://127.0.0.1:5004 
:NO
start cmd /k "node index.js 0"
start cmd /k "node index.js 1"
start cmd /k "node index.js 2"
start cmd /k "node index.js 3"
start cmd /k "node index.js 4"


