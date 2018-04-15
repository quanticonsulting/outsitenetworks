function main() {
    return join(
        Events({
            from_date: "2018-01-01",
            to_date: "2018-01-24",
            event_selectors: [{
                event: 'Consumer Transaction'
            }]
        }),
        People(), {
            type: "inner",
            selectors: [{
                selector: '(user[".Profile type"] == "PERSON") '       }]
        })
        .groupByUser((_state, tuples) => {
      return {
        "Email": tuples[0].user.properties.$email,
        "Name": tuples[0].user.properties.$name,
        "Allow Email": tuples[0].user.properties["Allow Email"],
        "Registration Country": tuples[0].user.properties["Registration Country"],
        "Transaction Count": _.reduce(tuples, (memo, x) => (x.event.name === "Consumer Transaction") ? memo+1 : memo, 0)
      };
    });
}