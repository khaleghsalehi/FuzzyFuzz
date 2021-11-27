#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void lol(char *b)
{
    char buffer[1337];
    strcpy(buffer, b);
}

int main(int argc, char **argv)
{
    lol(argv[1]);
}
