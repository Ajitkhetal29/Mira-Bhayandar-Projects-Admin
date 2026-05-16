import React from "react";
import { useContext } from "react";
import { AppConetxt } from "../context/context";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllFaq = () => {
  const { allFaq, getAllFaq, deleteFaq, backendUrl } = useContext(AppConetxt);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [faqFormOpen, setFaqFormOpen] = useState(false);

  useEffect(() => {
    getAllFaq();
  }, []);

  const [updateForm, setUpdateForm] = useState({
    id: "",
    question: "",
    answer: "",
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
  });
  const faqFormChange = (e) => {
    setFaqForm({ ...faqForm, [e.target.name]: e.target.value });
  };
  const updateFormChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/faq/addfaq`,
        faqForm,
        {}
      );
      if (response.data.success) {
        toast.success("New FAQ Added", { autoClose: 2000 });
        getAllFaq();
        setFaqForm({ question: "", answer: "" });
      } else {
        console.log(response.data.message);
      }
      console.log("response", response);
    } catch (error) {}
  };

  const handleUpdateFaq = async (e) => {
    e.preventDefault();
    console.log("update form", updateForm);

    try {
      const response = await axios.put(
        `${backendUrl}/api/faq/updateFaq`,
        updateForm,
        {}
      );
      if (response.data.success) {
        toast.success("FAQ Updated", { autoClose: 2000 });
        getAllFaq();
        setEditingFaqId(null);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!allFaq) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-neutral-950 min-h-screen text-white">
      <div className="w-full max-w-7xl mb-5 mx-auto px-4 py-10 pt-10 sm:px-6 lg:px-8">
        {/* --- Page Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              All FAQ's
            </h1>
            <p className="mt-1 text-lg text-gray-400">
              Manage, update, or delete existing FAQ's.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFaqFormOpen((prev) => !prev)}
            className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-bold shadow-lg transition-colors duration-300 whitespace-nowrap"
          >
            + Add FAQ
          </button>
        </div>

        <div>
          {faqFormOpen && (
            <div className="border p-4 mb-4 rounded shadow">
              <h3 className="text-md text-center font-semibold mb-4">
                Add New FAQ
              </h3>
              <div className="space-y-4">
                <label className="block text-sm  mb-2 text-white">
                  Question:
                </label>
                <input
                  type="text"
                  placeholder=""
                  name="question"
                  className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={faqForm.question}
                  onChange={faqFormChange}
                />
                <label className="block text-sm mb-2 text-white">Answer</label>
                <input
                  type="text"
                  placeholder=""
                  name="answer"
                  className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={faqForm.answer}
                  onChange={faqFormChange}
                />
                <div className="flex gap-2">
                  <button
                    className=" bg-white cursor-pointer hover:bg-yellow-500 text-black px-3 py-1 rounded-sm  shadow-lg transition-colors duration-300 whitespace-nowrap"
                    type="button"
                    onClick={(e) => handleAddFaq(e)}
                  >
                    Add
                  </button>
                  <button
                    className="cursor-pointer bg-red-500 hover:bg-yellow-500 text-white px-3 py-1 rounded-sm  shadow-lg transition-colors duration-300 whitespace-nowrap"
                    type="button"
                    onClick={() => setFaqFormOpen((prev) => !prev)}
                  >
                    disacrd
                  </button>
                </div>
              </div>
            </div>
          )}
          {allFaq.map((faq) => (
            <div key={faq._id} className="border p-4 mb-4 rounded shadow">
              {faq._id === editingFaqId ? (
                <div className="space-y-4">
                  <label className="block text-sm  mb-2 text-white">
                    Question:
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="question"
                    value={updateForm.question}
                    onChange={updateFormChange}
                  />
                  <label className="block text-sm  mb-2 text-white">
                    Answer
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    name="answer"
                    className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={updateForm.answer}
                    onChange={updateFormChange}
                  />

                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer bg-red-500 hover:bg-yellow-500 text-white px-3 py-1 rounded-sm  shadow-lg transition-colors duration-300 whitespace-nowrap"
                      onClick={() => setEditingFaqId()}
                    >
                      discard
                    </button>
                    <button
                      className="cursor-pointer bg-yellow-200 hover:bg-yellow-500 text-black px-3 py-1 rounded-sm  shadow-lg transition-colors duration-300 whitespace-nowrap"
                      onClick={handleUpdateFaq}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <label className="block text-sm  mb-2 text-white">
                    Question :
                  </label>
                  <p className="text-md mb-2 bg-gray-800 rounded-sm p-2">
                    {faq.question}
                  </p>

                  <label className="block text-sm mb-2 text-white">
                    Answer :
                  </label>
                  <p className="text-md mb-2 bg-gray-800 rounded-sm p-2 text-green-500">
                    {faq.question}
                  </p>

                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer bg-yellow-400 hover:bg-black hover:text-white text-black px-3 py-1 rounded-sm  shadow-lg transition-colors duration-300 whitespace-nowrap"
                      type="button"
                      onClick={() => {
                        setEditingFaqId(faq._id);
                        setUpdateForm({
                          question: faq.question,
                          answer: faq.answer,
                          id: faq._id,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="cursor-pointer bg-red-500 hover:bg-black text-white px-3 py-1 rounded-sm  shadow-lg transition-colors duration-300 whitespace-nowrap"
                      type="button"
                      onClick={() => deleteFaq(faq._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AllFaq;
