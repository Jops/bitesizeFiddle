
var example1 =
"// for example:\n\
var start = ~input:1:number:0~; // editable\n\
var end = ~input:2:number:5~; // editable\n\
\n\
// the 'afterthought' can be edited\n\
for (start; start <= end; ~input:3:text:start = start + 1~) {\n\
&nbsp;&nbsp;&nbsp;&nbsp;display(\"~input:4:text:Next number is:~\"); // editable parameter\n\
&nbsp;&nbsp;&nbsp;&nbsp;display(start);\n\
}";

var example2 =
"// for example:\n\
var firstname = \"~input:1:text:John~\"; // editable\n\
var Surname = \"~input:2:text:Smith~\"; // editable\n\
\n\
display( ~input:3:text:\'My name is \' + firstname + \' \' + Surname~ );";

var example = example1;

var codeBlock, displayBlock,
    executeBtn, resetBtn1, resetBtn2;

var fiddlerMain = function() {
    codeBlock = document.getElementById("code-block");
    executeBtn = document.getElementById("fiddle-execute-btn").onclick = executeCode;
    resetBtn1 = document.getElementById("fiddle-reset-btn").onclick = resetCode1;
    resetBtn2 = document.getElementById("fiddle-reset2-btn").onclick = resetCode2;
    displayBlock = document.getElementById("code-output-display");

    resetCode1();
};

var display = function( msg ) {
    displayBlock.value += msg + "\n";
};

var executeCode = function() {
    displayBlock.value = "";
    eval( cleanupHTML( buildExecuteFunc() ) );
};

var buildExecuteFunc = function() {
    function replacer( match, p1, offset, string )
    {
        return document.getElementsByName( "code_" + p1 )[0].value;
    }
    return example.replace( /\~input:(\d+).*\~/gm, replacer );
};

var resetCode = function() {
    codeBlock.innerHTML = buildExampleMarkup();
    displayBlock.value = "";
};

var resetCode1 = function() {
    example = example1;
    resetCode();
};

var resetCode2 = function() {
    example = example2;
    resetCode();
};

var buildExampleMarkup = function( codeText ) {
    function replacer( match, p1, p2, p3, offset, string )
    {
        return "<input name=\"code_"+p1+"\" \
                type=\""+p2+"\" \
                value=\""+p3+"\"></input>";
    }
    var finishedExample = example.replace(  /\~input:(.*):(\w*):(.*)\~/gm,
                                            replacer );
    finishedExample = finishedExample.replace( /\n/gm, "<br/>");
    return finishedExample;
};

var cleanupHTML = function(text) {
    text = text.replace(/&lt;/g, "<");
    text = text.replace(/&gt;/g, ">");
    text = text.replace(/&amp;/g, "&");
    text = text.replace(/&nbsp;/g, " ");
    return text;
};