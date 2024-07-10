# AutoShackMono
[![Run Cypress Tests](https://github.com/rkennedy1/autoShackMono/actions/workflows/cypress-tests.yml/badge.svg)](https://github.com/rkennedy1/autoShackMono/actions/workflows/cypress-tests.yml)



Starting the Server:

    screen -S ShackController
    cd Code/autoShackMono/shackController/scripts/
    python3 autoShack.py

    NOTE: if the system complains about the temp/hum sensor you may need to issue the following

    sudo pigpiod

Leaving the ShackController screen

    “Ctrl-A ” and “d” to detach the screen. 

Looking at Logs and cool commands:

    cd Code/autoShackMono/shackController/logs/
    