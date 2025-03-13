"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Account, Field, Type } from "@/lib/types";
import { useIDLStore } from "@/store/idl-store";

const StateView = () => {
  // ✅ Fix: Use shallow comparison to prevent excessive re-renders
  const idlData = useIDLStore(
    (state) => (state.idlData)
  );

  const accounts = idlData.accounts || [];
  const types = idlData.types || [];

  const [activeTab, setActiveTab] = useState(accounts.length > 0 ? accounts[0].name : "");

  const getAccountType = (accountName: string) => {
    return types.find((type: Type) => type.name === accountName);
  };

  const renderFieldType = (fieldType: any) => {
    if (typeof fieldType === "string") {
      return fieldType;
    } else if (fieldType.vec) {
      return `Vec<${fieldType.vec}>`;
    } else if (fieldType.option) {
      return `Option<${fieldType.option}>`;
    } else {
      return JSON.stringify(fieldType);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts ({accounts.length})</CardTitle>
        <CardDescription>All accounts defined in the IDL with their structure and fields</CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No accounts found.</p>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="overflow-x-auto flex space-x-2">
              {accounts.map((account: Account) => (
                <TabsTrigger key={account.name} value={account.name} className="whitespace-nowrap">
                  {account.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {accounts.map((account:Account) => {
              const accountType = getAccountType(account.name);
              return (
                <TabsContent key={account.name} value={account.name} className="mt-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Discriminator</h4>
                      <div className="bg-muted p-2 rounded-md text-xs font-mono overflow-x-auto">
                        [{account.discriminator.join(", ")}]
                      </div>
                    </div>

                    {accountType && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Fields</h4>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="text-left p-2">Name</th>
                                <th className="text-left p-2">Type</th>
                              </tr>
                            </thead>
                            <tbody>
                              {accountType.type.fields.map((field: Field, fieldIndex:number) => (
                                <tr key={fieldIndex} className="border-t">
                                  <td className="p-2 font-mono">{field.name}</td>
                                  <td className="p-2 font-mono">{renderFieldType(field.type)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default StateView;
