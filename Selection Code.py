import random 

number_of_inputs = int(input("Enter the number of inputs: "))

list_of_inputs = []
ranked_list_of_inputs = []
number_of_questions = 1

for i in range(number_of_inputs): 
    user_input = input(f"Enter input {i + 1}: ")
    list_of_inputs.append(user_input)

selected_input_1 = random.choice(list_of_inputs)

subtracted_list_of_inputs = list_of_inputs.copy()
subtracted_list_of_inputs.remove(selected_input_1)

selected_input_2 = random.choice(subtracted_list_of_inputs)

print(f"Which input is more important {selected_input_1} or {selected_input_2}?")

if input(f"Select between {selected_input_1} and {selected_input_2}: ") == selected_input_1:
    ranked_list_of_inputs.append(selected_input_1)
    ranked_list_of_inputs.append(selected_input_2)
else:
    ranked_list_of_inputs.append(selected_input_2)
    ranked_list_of_inputs.append(selected_input_1)

for item in list_of_inputs:
    if item not in ranked_list_of_inputs:
        print("The current ranking is:", ranked_list_of_inputs)
        print("Place the following input in the ranking:", item)

        left = 0 
        right = len(ranked_list_of_inputs)

        while left < right:
            mid = (left + right) // 2 
            print(f"\nIs '{item}' MORE important than '{ranked_list_of_inputs[mid]}'?")
            response = input("Type 'yes' or 'no': ").lower()

            if response == 'yes': 
                right = mid 
            else: 
                left = mid + 1
        number_of_questions += 1
        
        ranked_list_of_inputs.insert(left, item)
        print(f"Inserted '{item}' at position {left + 1}.")

print("Final ranking of inputs:", ranked_list_of_inputs)
print(f"Total number of questions asked: {number_of_questions}")
        