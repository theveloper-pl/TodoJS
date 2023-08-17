
function updateTodoStatus(checkbox) {
        let todoId = checkbox.getAttribute("data-id");
        let isChecked = checkbox.checked;

        fetch(`/update/${todoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                is_done: isChecked
            })
        }).then(response => response.json()).then(data => {
            console.log(data);
        });
}

