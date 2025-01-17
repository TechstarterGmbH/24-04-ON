import sys

if len(sys.argv) < 2:
    print("Bitte gib ein Argument ein (bspw ein Name)")
else: 
    name = sys.argv[1]
    print(f"Hallo, {name}! Willkommen bei Docker!")