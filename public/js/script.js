var submitLink = document.getElementsByClassName("response");

for(var i = 0 ; i < submitLink.length; i++){
    submitLink[i].addEventListener("click", function(){
        document.getElementById("delCommentForm").submit();
    });
}