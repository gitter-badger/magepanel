@echo off
setlocal
cls

call :printTitle
echo.

::::::::::::::::::::::::: Vars :::::::::::::::::::::::::
set pageTitle="MagePanel"
set host="localhost"
set port=4624
set url="http://"%host%":"%port%"/"

::::::::::::::::::::::::: Check for executables :::::::::::::::::::::::::
WHERE node
IF %ERRORLEVEL% NEQ 0 ECHO node is not installed in system, please install it before running this app & goto :eof

WHERE nodemon
IF %ERRORLEVEL% NEQ 0 ECHO nodemon is not installed in system, installing & call npm install nodemon -g & echo.

::::::::::::::::::::::::: Update Module Dependencies :::::::::::::::::::::::::
echo Update module dependencies if necessary..
echo.
call npm install

::::::::::::::::::::::::: Start Browser & App :::::::::::::::::::::::::
start %pageTitle% %url%
call nodemon -i logs/ app.js %host% %port%

pause

::::::::::::::::::::::::::::::: Print Title :::::::::::::::::::::::::::::::
:printTitle
echo "           _____                    _____                    _____                    _____                    _____                    _____                    _____                    _____                    _____ "
echo "          /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \                  /\    \ "
echo "         /::\____\                /::\    \                /::\    \                /::\    \                /::\    \                /::\    \                /::\____\                /::\    \                /::\____\ "
echo "        /::::|   |               /::::\    \              /::::\    \              /::::\    \              /::::\    \              /::::\    \              /::::|   |               /::::\    \              /:::/    / "
echo "       /:::::|   |              /::::::\    \            /::::::\    \            /::::::\    \            /::::::\    \            /::::::\    \            /:::::|   |              /::::::\    \            /:::/    / "
echo "      /::::::|   |             /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \          /:::/\:::\    \          /::::::|   |             /:::/\:::\    \          /:::/    / "
echo "     /:::/|::|   |            /:::/__\:::\    \        /:::/  \:::\    \        /:::/__\:::\    \        /:::/__\:::\    \        /:::/__\:::\    \        /:::/|::|   |            /:::/__\:::\    \        /:::/    / "
echo "    /:::/ |::|   |           /::::\   \:::\    \      /:::/    \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \      /::::\   \:::\    \      /:::/ |::|   |           /::::\   \:::\    \      /:::/    / "
echo "   /:::/  |::|___|______    /::::::\   \:::\    \    /:::/    / \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \    /::::::\   \:::\    \    /:::/  |::|   | _____    /::::::\   \:::\    \    /:::/    / "
echo "  /:::/   |::::::::\    \  /:::/\:::\   \:::\    \  /:::/    /   \:::\ ___\  /:::/\:::\   \:::\    \  /:::/\:::\   \:::\____\  /:::/\:::\   \:::\    \  /:::/   |::|   |/\    \  /:::/\:::\   \:::\    \  /:::/    / "
echo " /:::/    |:::::::::\____\/:::/  \:::\   \:::\____\/:::/____/  ___\:::|    |/:::/__\:::\   \:::\____\/:::/  \:::\   \:::|    |/:::/  \:::\   \:::\____\/:: /    |::|   /::\____\/:::/__\:::\   \:::\____\/:::/____/ "
echo " \::/    / ~~~~~/:::/    /\::/    \:::\  /:::/    /\:::\    \ /\  /:::|____|\:::\   \:::\   \::/    /\::/    \:::\  /:::|____|\::/    \:::\  /:::/    /\::/    /|::|  /:::/    /\:::\   \:::\   \::/    /\:::\    \ "
echo "  \/____/      /:::/    /  \/____/ \:::\/:::/    /  \:::\    /::\ \::/    /  \:::\   \:::\   \/____/  \/_____/\:::\/:::/    /  \/____/ \:::\/:::/    /  \/____/ |::| /:::/    /  \:::\   \:::\   \/____/  \:::\    \ "
echo "              /:::/    /            \::::::/    /    \:::\   \:::\ \/____/    \:::\   \:::\    \               \::::::/    /            \::::::/    /           |::|/:::/    /    \:::\   \:::\    \       \:::\    \ "
echo "             /:::/    /              \::::/    /      \:::\   \:::\____\       \:::\   \:::\____\               \::::/    /              \::::/    /            |::::::/    /      \:::\   \:::\____\       \:::\    \ "
echo "            /:::/    /               /:::/    /        \:::\  /:::/    /        \:::\   \::/    /                \::/____/               /:::/    /             |:::::/    /        \:::\   \::/    /        \:::\    \ "
echo "           /:::/    /               /:::/    /          \:::\/:::/    /          \:::\   \/____/                  ~~                    /:::/    /              |::::/    /          \:::\   \/____/          \:::\    \ "
echo "          /:::/    /               /:::/    /            \::::::/    /            \:::\    \                                           /:::/    /               /:::/    /            \:::\    \               \:::\    \ "
echo "         /:::/    /               /:::/    /              \::::/    /              \:::\____\                                         /:::/    /               /:::/    /              \:::\____\               \:::\____\ "
echo "         \::/    /                \::/    /                \::/____/                \::/    /                                         \::/    /                \::/    /                \::/    /                \::/    / "
echo "          \/____/                  \/____/                                           \/____/                                           \/____/                  \/____/                  \/____/                  \/____/  "