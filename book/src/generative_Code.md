# Generative Code

In sus, metaprogramming simplifies hardware design by generating repetitive structures efficiently. 

![Generative Code](/images/generativeCode.png)


For loops don’t create runtime pipelines but directly instantiate hardware, like 600 multipliers and adders.

Sus works on two levels:

Metaprogramming generates hardware structures.
Runtime statements define circuit behavior.
Within modules, you can use loops, variables, and conditionals. For cross-module generation, templates are used.



# Templates

Sus supports templates to handle array slicing and other reusable structures.

![Templates](/images/templates.png)


At the top, we define type parameters, allowing the template to accept any array of any type (T), such as int, bool, or custom types. Below, we have value parameters, which are part of the module body. These can have default values or be conditionally included based on logic.

To instantiate a template, Sus uses a syntax similar to Rust with ::
First, provide value parameters.
Then, specify type parameters at the end.

Templates also enable recursive modules, which are essential for trees hardware structures.

# Recursive Modules

![Recursive Modules](/images/recursiveModules.png)

We have a module tree that takes in a set of numbers and compresses them down to a single sum.

There are two base cases: one where there are zero elements and one where there is a single element. We handle these explicitly.

For the recursive cases, we split the array into two chunks, process each chunk individually (summing their elements), and then combine the results.

Additionally, we can introduce a pipelining stage if needed. The compiler can automatically insert these stages without issues. While adding pipelining stages won’t break the code itself, they might cause build failures, in which case you’ll need to fix the errors flagged by the S compiler.

One key advantage of this approach is that it makes it extremely easy to add pipelining stages wherever necessary.