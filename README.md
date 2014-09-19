BitesizeFiddle
==============

Allow Bitesize users studying computing to execute Javascript snippets as part of their learning in chapter.

* Illusion of being able to freely edit the example.
* Example is in the form of an editable text area, but the sample (e.g: for loop) should correct itself and guide the learner.
* Effectively they cannot execute the example until the example is syntactically correct.
* Learner is presented with sections of the code which they are encouraged to play with and edit.
* Backend can rely on the example never changing on request to execute save specific parameters which form part of the guide to that lesson.
* Each Fiddle section comes with two viewports; the example code and the output area.

```javascript
// for example:
var start = 0; // editable
var end = 10; // editable

// the 'afterthought' can be edited
//                       |-----------------|
for (start; start <= end; start = start + 1) {
    display("Next number is:"); // editable parameter
    display(start);
}
```

From the above example we can see which parts of the example the learner may edit freely (value of two variables and the afterthought component to the for loop, as well as the parameter used in the first display method call).
The display method is assumed to be given.