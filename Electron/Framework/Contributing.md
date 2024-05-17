# Contribute Algorithms to the Framework

This document outlines the process for integrating new image comparison algorithms into the framework. Each algorithm is structured as a class with a standard initialization method and a `process` function for executing the algorithm on a list of image paths.

## Step 1: Create a New Folder for the Algorithm

1. In the root directory of the framework, create a new folder named after the algorithm you wish to add. For example, if adding an algorithm named "FastMatch", create a folder named `FastMatch`.

## Step 2: Algorithm Class Structure

2. Inside the new folder, create a Python file for your algorithm class. The filename should match the class name for clarity (e.g., `fastmatch.py` for a `FastMatch` class).

3. Define your class with the required attributes and the `process` method as outlined below:

```python
class YourAlgorithmName:
    def __init__(self, param1, param2, ...):
        self.name = "YourAlgorithmName"  # Algorithm's name
        self.duplicates = [] | set() # List or set to store exact duplicate pairs
        self.possible_duplicates = [] | set () # List or set to store possible duplicate pairs
        # Initialize any other necessary parameters specific to the algorithm
        self.param1 = param1
        self.param2 = param2
        # Add more parameters as needed

    def process(self, image_paths):
        """
        Processes a list of image paths, classifying pairs of images as duplicates or possible duplicates.
        """
        # Implement the algorithm logic here
        # Update self.duplicates and self.possible_duplicates based on the algorithm's findings
```

4. Implement the logic within the `process` method to analyze the images, compare them according to the algorithm's specific approach, and classify them into the `duplicates` or `possible_duplicates` lists.

## Step 3: Integrating the New Algorithm

After creating and testing your new algorithm class, the next step is to integrate it into the framework's processing flow. The framework uses a dynamic approach to apply various image comparison algorithms on a set of images, gather their results, and finally, print the final results indicating duplicates and possible duplicates. Here’s how to integrate your newly created algorithm:

5. Importing the Algorithm

First, import your algorithm class at the top of the script where the framework's processing flow is defined. Assume your new algorithm is named `NewAlgorithm` and is located in a folder named `NewAlgorithm` with a file named `newalgorithm.py`. You should import it like so:

```python
from NewAlgorithm.newalgorithm import NewAlgorithm
```

Add this import statement to the existing imports where other algorithms are imported.

6. Adding the Algorithm to the Processing Flow

Once imported, you need to add an instance of your algorithm to the list of algorithms that the framework will use to process the images. This is done by including your algorithm in the `layers` list:

```python
# Existing algorithm instances
layers = [Phash(), Dhash(), VGG(), SIFT()]

# Add your new algorithm instance
layers.append(NewAlgorithm())
```

Alternatively, if you prefer to keep the instantiation in the list definition:

```python
layers = [Phash(), Dhash(), VGG(), SIFT(), NewAlgorithm()]
```

7. Running the Framework

With your algorithm integrated, the framework is now ready to process images using the newly added algorithm alongside the existing ones. The `get_image_paths` function is used to recursively grab image paths from a specified directory, which are then passed along with the list of algorithms (`layers`) to the `Layers` class for processing:

```python
# Example directory containing images to test
image_paths = get_image_paths("Images/Manual_Tests")

# Instance of Layers class with the list of algorithm instances
layered_architecture = Layers(layers)

# Running the processing flow
layered_architecture.run(image_paths)

# Printing the final results
layered_architecture.print_final_results()
```

8. ~~Running existing tests~~

~~To run the test navigate to the `Tests` dir and run `pytest`~~

9. ~~Adding tests~~

~~In order to contribute at least one test should be written for each new function. In this project we are using pytest.~~

~~Conventions:~~

- ~~The new class should have a test folder name the same as the class inside the Tests dir.~~
- ~~Inside the test folder a test file named following test_modulename.py standard should be made.~~

```python
# Example test file structure. class TestVGG:
    @pytest.fixture
    def vgg(self):
        return VGG()

    def test_example(self):
        assert 1 == 1
```