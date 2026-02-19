[
  {
    id: "b2560477e3c45454da26b9ce065e0904",
    value: {
      actionRequests: [
        {
          name: "refund",
          args: { emails: ["john.doe@example.com", "mike.chen@example.com"] },
          description:
            'pending approval\n\nTool: refund\nArgs: {\n  "emails": [\n    "john.doe@example.com",\n    "mike.chen@example.com"\n  ]\n}',
        },
      ],
      reviewConfigs: [
        {
          actionName: "refund",
          allowedDecisions: ["approve", "edit", "reject"],
        },
      ],
    },
  },
];
