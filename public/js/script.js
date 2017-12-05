var submitLink = document.getElementsByClassName("reply");

for(var i = 0 ; i < submitLink.length; i++){
    submitLink[i].addEventListener("click", function(){
        document.getElementById("delCommentForm").submit();
    });
}